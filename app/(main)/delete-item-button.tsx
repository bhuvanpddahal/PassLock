"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { useRef, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { deleteItem } from "@/actions/item";
import { Button } from "@/components/ui/button";

interface DeleteItemButtonProps {
    id: string;
    siteName: string;
    email: string;
    favorited: boolean;
}

const DeleteItemButton = ({
    id,
    siteName,
    email,
    favorited
}: DeleteItemButtonProps) => {
    const payload = { id };
    const queryClient = useQueryClient();
    const closeRef = useRef<HTMLButtonElement>(null);
    const [isLoading, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(() => {
            deleteItem(payload).then((data) => {
                if (data?.error) {
                    toast.error(data.error);
                }
                if (data?.success) {
                    toast.success(data.success);
                    queryClient.invalidateQueries({
                        queryKey: ["dashboard"]
                    });
                    if (closeRef.current) closeRef.current.click();
                }
            }).catch(() => {
                toast.error("Something went wrong");
            });
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    variant="destructive"
                    className="gap-1"
                    size="sm"
                >
                    <Trash2 className="h-5 w-5 text-zinc-100" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this item? It will permanently delete the below item from PassLock.
                    </AlertDialogDescription>
                    <div className="flex items-center gap-2 p-3">
                        <div className="relative">
                            <Image
                                src="/padlock.png"
                                alt="Account"
                                height={40}
                                width={40}
                                className="rounded-md"
                            />
                            {favorited && (
                                <div className="absolute top-full left-full p-0.5 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full">
                                    <Star
                                        className="h-3 w-3"
                                        style={{ fill: "whitesmoke", color: "#aaa" }}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <span className="text-sm text-left font-medium text-zinc-900 block -mb-0.5">
                                {siteName}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {email}
                            </span>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        ref={closeRef}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        {isLoading ? "Deleting" : "Continue"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default DeleteItemButton;