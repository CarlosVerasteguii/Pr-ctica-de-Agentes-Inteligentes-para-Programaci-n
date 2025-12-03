import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { supabase } from '../lib/supabase';

export const server = {
    bookAppointment: defineAction({
        input: z.object({
            doctorId: z.string(),
            patientName: z.string().min(2, "ERROR: INVALID_IDENTIFIER_LENGTH"),
            patientEmail: z.string().email("ERROR: INVALID_CONTACT_PROTOCOL"),
            startTime: z.string().datetime(), // Validates ISO string
        }),
        handler: async (input) => {
            const { doctorId, patientName, patientEmail, startTime } = input;

            console.log(`[SYSTEM_LOG] Initiating allocation sequence for Unit ${doctorId} at ${startTime}`);

            // 1. Validate that the time is in the future
            if (new Date(startTime) < new Date()) {
                throw new Error("ERROR: TEMPORAL_VIOLATION_DETECTED");
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
                console.error('[SYSTEM_ERROR] Database Transaction Failed:', error);

                // Handle unique constraint violation (Race Condition)
                if (error.code === '23505') { // Postgres code for unique_violation
                    throw new Error("ERROR: RESOURCE_CONTENTION_DETECTED (Slot taken)");
                }

                throw new Error("ERROR: WRITE_OPERATION_FAILED");
            }

            return {
                success: true,
                message: 'ALLOCATION_CONFIRMED',
                appointmentId: data.id
            };
        },
    }),
};
