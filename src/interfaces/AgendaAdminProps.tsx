import Cliente from "./Cliente";

type AgendaAdminProps = {
  isLoading: boolean;
  clientes: Cliente[];
  deleteCliente: (id: string) => void;
  startEdit: (cliente: Cliente) => void;
};

export default AgendaAdminProps;
