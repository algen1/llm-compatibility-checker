export function Button({ children, ...props }) {
    return <button className="p-2 bg-blue-500 text-white rounded" {...props}>{children}</button>;
  }
  