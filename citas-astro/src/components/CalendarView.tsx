import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { actions } from 'astro:actions';

const locales = {
    'es': es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const WORK_START_HOUR = 8;
const WORK_END_HOUR = 20;

interface Appointment {
    start: Date;
    end: Date;
    title: string;
}

interface Props {
    doctorId: string;
    initialAppointments?: Appointment[];
}

export default function CalendarView({ doctorId, initialAppointments = [] }: Props) {
    const [newAppointments, setNewAppointments] = useState<Appointment[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Memoize parsed events to avoid double-render and unnecessary calculations
    const allEvents = useMemo(() => {
        const parsedInitial = initialAppointments.map(evt => ({
            ...evt,
            start: new Date(evt.start),
            end: new Date(evt.end)
        }));
        return [...parsedInitial, ...newAppointments];
    }, [initialAppointments, newAppointments]);

    const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
        // Prevent selecting past dates
        if (start < new Date()) {
            setMessage({ type: 'error', text: 'No puedes reservar en el pasado.' });
            return;
        }

        // Check for conflicts locally
        const hasConflict = allEvents.some(evt =>
            (start >= evt.start && start < evt.end) ||
            (end > evt.start && end <= evt.end)
        );

        if (hasConflict) {
            setMessage({ type: 'error', text: 'Este horario ya está ocupado.' });
            return;
        }

        setSelectedSlot({ start, end });
        setIsBooking(true);
        setMessage(null);
    }, [allEvents]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) return;

        setMessage(null);

        // Call Astro Action
        const { data, error } = await actions.bookAppointment({
            doctorId,
            patientName: formData.name,
            patientEmail: formData.email,
            startTime: selectedSlot.start.toISOString(),
        });

        if (error) {
            setMessage({ type: 'error', text: error.message || 'Error al reservar.' });
            return;
        }

        if (data?.success) {
            setMessage({ type: 'success', text: '¡Cita reservada con éxito!' });
            // Add new event locally to update UI immediately
            setNewAppointments(prev => [...prev, {
                start: selectedSlot.start,
                end: selectedSlot.end,
                title: 'Reservado'
            }]);
            setIsBooking(false);
            setFormData({ name: '', email: '' });
            setSelectedSlot(null);
        } else {
            setMessage({ type: 'error', text: 'No se pudo reservar.' });
        }
    };

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isBooking) {
                setIsBooking(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isBooking]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            {message && (
                <div className={`p-4 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="h-[600px] mb-8">
                <Calendar
                    localizer={localizer}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    views={[Views.WEEK, Views.DAY]}
                    defaultView={Views.WEEK}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    min={new Date(0, 0, 0, WORK_START_HOUR, 0, 0)}
                    max={new Date(0, 0, 0, WORK_END_HOUR, 0, 0)}
                    culture='es'
                    messages={{
                        next: "Siguiente",
                        previous: "Anterior",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "Sin citas en este rango",
                    }}
                />
            </div>

            {isBooking && selectedSlot && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsBooking(false);
                    }}
                >
                    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">Confirmar Cita</h3>
                        <p className="mb-6 text-slate-600">
                            Reservando para el <strong>{format(selectedSlot.start, 'dd/MM/yyyy HH:mm')}</strong>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsBooking(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                >
                                    Confirmar Reserva
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
