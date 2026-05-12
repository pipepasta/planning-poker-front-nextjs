import { Skeleton } from "@/app/_components/ui/base/Skeleton";

/**
 * dummy component for NameAndVote
 * @constructor
 */
const DummyNameAndVote = () => (
    <div className="flex justify-between items-center">
        <div className="p-2 flex-1 flex justify-center">
            <Skeleton className="h-6 w-20" />
        </div>
        <div className="p-2 flex-1 flex justify-center">
            <Skeleton className="size-6" />
        </div>
    </div>
);
export default DummyNameAndVote;
