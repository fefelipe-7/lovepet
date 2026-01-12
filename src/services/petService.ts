import { supabase } from './supabaseClient';
import { PetState, Mood } from '../types';

export const PetService = {
    // Save entire pet state
    async savePetState(pet: PetState) {
        // Assuming we have a single pet for now, or using ID 'default_pet'
        const { data, error } = await supabase
            .from('pets')
            .upsert({
                id: 'default_pet', // Fixed ID for single pet per instance scenario
                name: pet.name,
                mood: pet.mood,
                hunger: pet.hunger,
                energy: pet.energy,
                cleanliness: pet.cleanliness,
                happiness: pet.happiness,
                satisfaction: pet.satisfaction,
                is_sleeping: pet.isSleeping,
                image_url: pet.image,
                last_updated: new Date().toISOString()
            })
            .select();

        if (error) {
            console.error('Error saving pet state:', error);
            return null;
        }
        return data;
    },

    // Load pet state
    async loadPetState(): Promise<PetState | null> {
        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('id', 'default_pet')
            .single();

        if (error) {
            if (error.code !== 'PGRST116') { // Ignore "Row not found" error
                console.error('Error loading pet state:', error);
            }
            return null;
        }

        if (!data) return null;

        return {
            name: data.name,
            mood: data.mood as Mood,
            hunger: data.hunger,
            energy: data.energy,
            cleanliness: data.cleanliness,
            happiness: data.happiness,
            satisfaction: data.satisfaction,
            isSleeping: data.is_sleeping,
            image: data.image_url || undefined,
            // Map other fields back to PetState if needed
        };
    }
};
