import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import '../styles/calendar-technical.css';
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
            setMessage({ type: 'error', text: 'No se puede reservar en el pasado.' });
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
            setMessage({ type: 'error', text: error.message || 'Error al procesar la reserva.' });
            return;
        }

        if (data?.success) {
            setMessage({ type: 'success', text: 'CITA CONFIRMADA' });
            // Add new event locally to update UI immediately
            setNewAppointments(prev => [...prev, {
                start: selectedSlot.start,
                end: selectedSlot.end,
                title: 'RESERVADO'
            }]);
            setIsBooking(false);
            setFormData({ name: '', email: '' });
            setSelectedSlot(null);
        } else {
            setMessage({ type: 'error', text: 'Error desconocido.' });
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
        <div className="h-full font-mono text-sm">
            {message && (
                <div className={`p-4 mb-6 border ${message.type === 'success'
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-red-50 border-red-500 text-red-700'
                    }`}>
                    {'>'} {message.text}
                </div>
            )}

            <div className="h-[600px] bg-white border border-border p-4">
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
                        next: "SIGUIENTE",
                        previous: "ANTERIOR",
                        today: "HOY",
                        month: "MES",
                        week: "SEMANA",
                        day: "DÍA",
                        date: "FECHA",
                        time: "HORA",
                        event: "CITA",
                        noEventsInRange: "SIN CITAS",
                    }}
                />
            </div>

            {isBooking && selectedSlot && (
                <div
                    className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsBooking(false);
                    }}
                >
                    <div className="bg-background border border-primary p-8 max-w-md w-full shadow-brutal relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
                        <h3 className="text-2xl font-display font-bold mb-2 text-primary">CONFIRMAR CITA</h3>
                        <p className="mb-8 text-secondary font-mono text-sm">
                            {'>'} FECHA: <strong className="text-accent">{format(selectedSlot.start, 'dd/MM/yyyy HH:mm')}</strong>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2 font-mono">Nombre del Paciente</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-surface border border-border text-primary focus:border-accent focus:ring-0 transition-all outline-none font-mono text-sm"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2 font-mono">Email de Contacto</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-surface border border-border text-primary focus:border-accent focus:ring-0 transition-all outline-none font-mono text-sm"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsBooking(false)}
                                    className="px-6 py-3 text-secondary hover:text-primary border border-transparent hover:border-border font-mono text-xs uppercase tracking-wider transition-colors"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-primary text-white hover:bg-accent font-mono text-xs uppercase tracking-wider transition-all"
                                >
                                    CONFIRMAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
