import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { supabase } from '../lib/supabase';

export const server = {
    bookAppointment: defineAction({
        input: z.object({
            doctorId: z.string(),
            patientName: z.string().min(2, "El nombre es muy corto"),
            patientEmail: z.string().email("Email inválido"),
            startTime: z.string().datetime(), // Validates ISO string
        }),
        handler: async (input) => {
            const { doctorId, patientName, patientEmail, startTime } = input;

            console.log(`Intentando reservar para Dr. ${doctorId} a las ${startTime}`);

            // 1. Validate that the time is in the future
            if (new Date(startTime) < new Date()) {
                throw new Error("No puedes reservar en el pasado.");
            }

            // 2. Attempt to insert into Supabase
            // The database constraint 'unique_doctor_time' will handle race conditions automatically.
            const { data, error } = await supabase
                .from('appointments')
                .insert([
                    {
                        doctor_id: doctorId,
                        patient_name: patientName,
                        patient_email: patientEmail,
                        start_time: startTime,
                        status: 'confirmed'
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Supabase Error:', error);

                // Handle unique constraint violation (Race Condition)
                if (error.code === '23505') { // Postgres code for unique_violation
                    throw new Error("Lo sentimos, este horario acaba de ser reservado por otra persona.");
                }

                throw new Error("Error al guardar la cita. Intente nuevamente.");
            }

            return {
                success: true,
                message: 'Cita reservada con éxito',
                appointmentId: data.id
            };
        },
    }),
};
