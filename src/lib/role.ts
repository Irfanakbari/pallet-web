import { Session } from "next-auth";

export const userRole = (user: Session) => {
  const palletAppRole = user.user?.roles?.find(role => role === 'pallet-control');
  return palletAppRole !== undefined;
};

export const isAdmin = (user: Session| null) => {
  const palletAppRole = user?.user?.roles
  return palletAppRole?.find((r:any)=> r==='admin')
};

export const isSuper = (user: Session| null) => {
  const palletAppRole = user?.user?.roles
  return palletAppRole?.find((r:any)=> r==='super')
};
