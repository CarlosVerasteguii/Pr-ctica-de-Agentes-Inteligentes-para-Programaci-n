import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { supabase } from '../lib/supabase';

export const server = {
    bookAppointment: defineAction({
        accept: 'form',
        input: z.object({
            doctorId: z.string(),
            patientName: z.string().min(2),
            patientEmail: z.string().email(),
            startTime: z.string(), // ISO string
        }),
        handler: async (input) => {
            // TODO: Implement DB insertion and race condition check
            console.log('Booking request:', input);
            return { success: true, message: 'Cita reservada (Simulado)' };
        },
    }),
};
