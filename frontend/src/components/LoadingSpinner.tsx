interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'green' | 'white' | 'gray';
}

export default function LoadingSpinner({ size = 'medium', color = 'green' }: LoadingSpinnerProps) {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12',
    };

    const colorClasses = {
        green: 'border-green-600',
        white: 'border-white',
        gray: 'border-gray-600',
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`animate-spin rounded-full border-4 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
            />
        </div>
    );
}