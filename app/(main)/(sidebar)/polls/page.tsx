import PollsContent from "./Content";

export const metadata = {
    title: {
        absolute: "Unmask - Anonymous and Professional Community"
    }
};

const PollsPage = () => {
    return (
        <div className="flex-1 p-4 sm:p-6 pt-4 space-y-4">
            <PollsContent />
        </div>
    )
};

export default PollsPage;