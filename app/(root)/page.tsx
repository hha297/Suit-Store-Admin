import { UserButton } from '@clerk/nextjs';

const SetupPage = () => {
        return (
                <div className="text-3xl">
                        <UserButton afterSignOutUrl="/" />
                </div>
        );
};

export default SetupPage;
