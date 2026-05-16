import { User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/ui/base/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/_components/ui/base/Dialog";
import { Input } from "@/app/_components/ui/base/Input";

interface Props {
    onSubmit: (value: string) => void;
}
const EditNameDialog = (props: Props) => {
    const [nameCandidate, setNameCandidate] = useState<string>("");
    const isValid = (nameCandidate: string) => !!nameCandidate;

    const handleSubmit = () => {
        if (!isValid(nameCandidate)) return;
        props.onSubmit(nameCandidate);
        setNameCandidate("");
    };
    return (
        <Dialog>
            <DialogTrigger>
                <User size={18} color={"white"} />
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Change Name</DialogTitle>
                    <DialogDescription>
                        Enter a display name to use in this room.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    maxLength={15}
                    className="w-1/2 px-4 justify-self-center"
                    type="text"
                    placeholder="input name"
                    onChange={(event) => setNameCandidate(event.target.value)}
                />
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button
                            disabled={!isValid(nameCandidate)}
                            type="button"
                            onClick={handleSubmit}
                        >
                            Save name
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditNameDialog;
