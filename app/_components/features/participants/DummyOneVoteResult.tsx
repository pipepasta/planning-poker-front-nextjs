import { Skeleton } from "@/app/_components/ui/base/Skeleton";

interface Props {
    title: string;
}

/**
 * dummy component for OneVoteResult
 * @param voteResult
 * @constructor
 */
const DummyOneVoteResult = (voteResult: Props) => (
    <div className="flex flex-col justify-center items-center flex-1 m-1">
        <div>{voteResult.title}</div>
        <Skeleton className="size-8" />
    </div>
);

export default DummyOneVoteResult;
