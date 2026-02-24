import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClientUnit {
  id: string;
  unitCode: string;
  unitName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  contactPhone: string;
  status: 'active' | 'inactive';
  deployedCount: number;
}

export interface Client {
  id: string;
  clientCode: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  state: string;
  activeDeployments: number;
  status: string;
  contractValue: number;
  units: ClientUnit[];
}

interface ClientsStore {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'clientCode' | 'status' | 'units'>) => string;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addUnit: (clientId: string, unit: Omit<ClientUnit, 'id' | 'unitCode' | 'status' | 'deployedCount'>) => void;
  updateUnit: (clientId: string, unitId: string, data: Partial<ClientUnit>) => void;
  deleteUnit: (clientId: string, unitId: string) => void;
  getClient: (id: string) => Client | undefined;
  getClientByCode: (code: string) => Client | undefined;
  getUnit: (clientId: string, unitId: string) => ClientUnit | undefined;
  getUnitByCode: (code: string) => { client: Client; unit: ClientUnit } | undefined;
}

// Sample client data with units
const sampleClients: Client[] = [
  { 
    id: '1', 
    clientCode: 'CLI001', 
    companyName: 'ABC Manufacturing Pvt Ltd', 
    contactPerson: 'Mr. Ramesh Patel', 
    contactPhone: '9876543210', 
    contactEmail: 'ramesh@abcmfg.com', 
    city: 'Mumbai', 
    state: 'Maharashtra', 
    activeDeployments: 45, 
    status: 'active', 
    contractValue: 1500000,
    units: [
      { id: 'u1', unitCode: 'CLI001-UNI001', unitName: 'Factory Unit - Andheri', address: 'Plot 45, MIDC Industrial Area', city: 'Mumbai', state: 'MH', pincode: '400093', contactPerson: 'Mr. Sharma', contactPhone: '9876543220', status: 'active', deployedCount: 25 },
      { id: 'u2', unitCode: 'CLI001-UNI002', unitName: 'Warehouse - Bhiwandi', address: 'Sector 12, Industrial Zone', city: 'Bhiwandi', state: 'MH', pincode: '421302', contactPerson: 'Mr. Patil', contactPhone: '9876543221', status: 'active', deployedCount: 20 },
    ]
  },
  { 
    id: '2', 
    clientCode: 'CLI002', 
    companyName: 'XYZ Corporation', 
    contactPerson: 'Ms. Sunita Sharma', 
    contactPhone: '9876543211', 
    contactEmail: 'sunita@xyzcorp.com', 
    city: 'Pune', 
    state: 'Maharashtra', 
    activeDeployments: 38, 
    status: 'active', 
    contractValue: 1200000,
    units: [
      { id: 'u3', unitCode: 'CLI002-UNI001', unitName: 'Main Office - Hinjewadi', address: 'IT Park, Phase 2', city: 'Pune', state: 'MH', pincode: '411057', contactPerson: 'Ms. Kulkarni', contactPhone: '9876543230', status: 'active', deployedCount: 38 },
    ]
  },
  { 
    id: '3', 
    clientCode: 'CLI003', 
    companyName: 'Tech Industries Ltd', 
    contactPerson: 'Mr. Amit Kumar', 
    contactPhone: '9876543212', 
    contactEmail: 'amit@techind.com', 
    city: 'Bangalore', 
    state: 'Karnataka', 
    activeDeployments: 25, 
    status: 'active', 
    contractValue: 800000,
    units: [
      { id: 'u4', unitCode: 'CLI003-UNI001', unitName: 'Production Unit - Electronic City', address: 'Plot 78, Tech Park', city: 'Bangalore', state: 'KA', pincode: '560100', contactPerson: 'Mr. Reddy', contactPhone: '9876543240', status: 'active', deployedCount: 15 },
      { id: 'u5', unitCode: 'CLI003-UNI002', unitName: 'R&D Center - Whitefield', address: 'ITPL Main Road', city: 'Bangalore', state: 'KA', pincode: '560066', contactPerson: 'Ms. Nair', contactPhone: '9876543241', status: 'active', deployedCount: 10 },
    ]
  },
  { 
    id: '4', 
    clientCode: 'CLI004', 
    companyName: 'Global Services Inc', 
    contactPerson: "Mr. John D'Souza", 
    contactPhone: '9876543213', 
    contactEmail: 'john@globalserv.com', 
    city: 'Chennai', 
    state: 'Tamil Nadu', 
    activeDeployments: 12, 
    status: 'active', 
    contractValue: 450000,
    units: [
      { id: 'u6', unitCode: 'CLI004-UNI001', unitName: 'Main Office - T Nagar', address: '15, Anna Salai', city: 'Chennai', state: 'TN', pincode: '600017', contactPerson: 'Mr. Venkat', contactPhone: '9876543250', status: 'active', deployedCount: 12 },
    ]
  },
];

export const useClientsStore = create<ClientsStore>()(
  persist(
    (set, get) => ({
      clients: sampleClients,
      
      addClient: (data) => {
        const id = String(Date.now());
        const count = get().clients.length + 1;
        const clientCode = `CLI${String(count).padStart(3, '0')}`;
        
        const newClient: Client = {
          ...data,
          id,
          clientCode,
          status: 'active',
          units: [],
        } as Client;
        
        set((state) => ({
          clients: [...state.clients, newClient],
        }));
        
        return clientCode;
      },
      
      updateClient: (id, data) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        }));
      },
      
      addUnit: (clientId, unitData) => {
        const client = get().getClient(clientId);
        if (!client) return;
        
        const id = `u${Date.now()}`;
        const unitCode = `${client.clientCode}-UNI${String(client.units.length + 1).padStart(3, '0')}`;
        
        const newUnit: ClientUnit = {
          ...unitData,
          id,
          unitCode,
          status: 'active',
          deployedCount: 0,
        } as ClientUnit;
        
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === clientId
              ? { ...c, units: [...c.units, newUnit] }
              : c
          ),
        }));
      },
      
      updateUnit: (clientId, unitId, data) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === clientId
              ? {
                  ...c,
                  units: c.units.map((u) =>
                    u.id === unitId ? { ...u, ...data } : u
                  ),
                }
              : c
          ),
        }));
      },
      
      deleteUnit: (clientId, unitId) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === clientId
              ? { ...c, units: c.units.filter((u) => u.id !== unitId) }
              : c
          ),
        }));
      },
      
      getClient: (id) => {
        return get().clients.find((c) => c.id === id);
      },
      
      getClientByCode: (code) => {
        return get().clients.find((c) => c.clientCode === code);
      },
      
      getUnit: (clientId, unitId) => {
        const client = get().getClient(clientId);
        return client?.units.find((u) => u.id === unitId);
      },
      
      getUnitByCode: (code) => {
        for (const client of get().clients) {
          const unit = client.units.find((u) => u.unitCode === code);
          if (unit) {
            return { client, unit };
          }
        }
        return undefined;
      },
    }),
    {
      name: 'hrms-clients',
    }
  )
);
