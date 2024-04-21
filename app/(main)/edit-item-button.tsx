"use client";

import {
    useEffect,
    useRef,
    useTransition
} from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    EditItemPayload,
    EditItemValidator
} from "@/lib/validators/item";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { editItem } from "@/actions/item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@radix-ui/react-dialog";

interface EditItemButtonProps {
    id: string;
    siteName: string;
    siteLink: string;
    email: string;
    password: string;
    favorited: boolean;
}

const EditItemButton = ({
    id,
    siteName,
    siteLink,
    email,
    password,
    favorited
}: EditItemButtonProps) => {
    const queryClient = useQueryClient();
    const closeRef = useRef<HTMLButtonElement>(null);
    const [isLoading, startTransition] = useTransition();

    const form = useForm<EditItemPayload>({
        resolver: zodResolver(EditItemValidator),
        defaultValues: {
            id,
            siteName,
            siteLink,
            email,
            password,
            favorited
        }
    });

    const onSubmit = (payload: EditItemPayload) => {
        startTransition(() => {
            editItem(payload).then((data) => {
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

    useEffect(() => {
        form.setValue("id", id);
        form.setValue("siteName", siteName);
        form.setValue("siteLink", siteLink);
        form.setValue("email", email);
        form.setValue("password", password);
        form.setValue("favorited", favorited);
    }, [id, siteName, siteLink, email, password, favorited]);

    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    variant="ghost"
                    className="gap-1"
                    size="sm"
                >
                    <Pencil className="h-4 w-4 text-zinc-600" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] w-full">
                <DialogHeader>
                    <DialogTitle>Edit Item</DialogTitle>
                    <DialogDescription>
                        Apply the changes and click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <div className='flex flex-col gap-y-4'>
                            <FormField
                                control={form.control}
                                name="siteName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Site Name</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="siteLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Site Link</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Email</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Password</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="favorited"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>
                                            <h3>Favorite</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-yellow-400 focus:ring-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-[#aaa]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="gap-y-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        ref={closeRef}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    isLoading={isLoading}
                                >
                                    {isLoading ? "Saving" : "Save"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};

export default EditItemButton;