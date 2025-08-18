import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Partner {
  id: number;
  entityName: string;
  entityType: string;
  representativeName: string;
  phone: string;
  email: string;
  partnershipDescription: string;
  dateAdded: string;
  status: 'active' | 'inactive' | 'pending';
  projectsCount: number;
  lastInteraction: string;
  tags: string[];
}

interface PartnersState {
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id' | 'dateAdded' | 'status' | 'projectsCount' | 'lastInteraction' | 'tags'>) => void;
  updatePartner: (id: number, partner: Partial<Partner>) => void;
  deletePartner: (id: number) => void;
  getPartnerById: (id: number) => Partner | undefined;
}

export const usePartnersStore = create<PartnersState>()(
  persist(
    (set, get) => ({
      partners: [],
      
      addPartner: (partnerData) => {
        const newPartner: Partner = {
          ...partnerData,
          id: Date.now(),
          dateAdded: new Date().toISOString().split('T')[0],
          status: 'active',
          projectsCount: 0,
          lastInteraction: new Date().toISOString().split('T')[0],
          tags: []
        };
        
        set((state) => ({
          partners: [...state.partners, newPartner]
        }));
      },
      
      updatePartner: (id, updatedData) => {
        set((state) => ({
          partners: state.partners.map(partner =>
            partner.id === id ? { ...partner, ...updatedData } : partner
          )
        }));
      },
      
      deletePartner: (id) => {
        set((state) => ({
          partners: state.partners.filter(partner => partner.id !== id)
        }));
      },
      
      getPartnerById: (id) => {
        return get().partners.find(partner => partner.id === id);
      }
    }),
    {
      name: 'partners-storage',
    }
  )
);