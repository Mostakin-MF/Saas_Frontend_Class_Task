interface AlertProps {
  type: "error" | "success" | "warning" | "info";
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  const styles = {
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
  };

  return (
    <div className={`p-4 border rounded-lg ${styles[type]}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}
