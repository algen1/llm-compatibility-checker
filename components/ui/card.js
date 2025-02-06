export function Card({ children }) {
    return <div className="p-4 border rounded shadow">{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div>{children}</div>;
  }
  