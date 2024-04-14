import { CheckCircle } from "lucide-react";

interface FormSuccessProps {
    message?: string;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
    if (!message) return null;

    return (
        <div className="w-full bg-emerald-500/15 px-3 py-2 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 max-w-4xl">
            <CheckCircle className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
};

export default FormSuccess;