import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/axios";
import { createCctv, updateCctvStatus } from "@/queries/cctv";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Video, PlusCircle, Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import {
  GET_CCTV_QUERY_KEY,
  CREATE_CCTV_MUTATION_KEY,
  UPDATE_CCTV_MUTATION_KEY,
} from "@/constants";

interface CctvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cctv?: ICctv;
}

export default function CctvModal({ isOpen, onClose, cctv }: CctvModalProps) {
  const { orgId } = useParams();
  const isEditMode = !!cctv;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ICctv>({
    defaultValues: {
      name: "",
      fullUrl: "",
      location: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (cctv && isEditMode) {
      setValue("name", cctv.name);
      setValue("fullUrl", cctv.fullUrl);
      setValue("location", cctv.location);
      setValue("isActive", cctv.isActive);
    }
  }, [cctv, isEditMode, setValue]);

  const createMutation = useMutation({
    mutationKey: [CREATE_CCTV_MUTATION_KEY],
    mutationFn: createCctv,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [[GET_CCTV_QUERY_KEY, orgId]],
      });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating CCTV:", error);
    },
  });

  const updateMutation = useMutation({
    mutationKey: [UPDATE_CCTV_MUTATION_KEY],
    mutationFn: updateCctvStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [[GET_CCTV_QUERY_KEY, orgId]],
      });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error("Error updating CCTV:", error);
    },
  });

  const onSubmit: SubmitHandler<ICctv> = (data) => {
    if (isEditMode && cctv) {
      updateMutation.mutate({ ...data, _id: cctv?._id, organization: cctv?.organization });
    } else {
      createMutation.mutate({ ...data, organization: orgId });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-full sm:max-w-md overflow-y-auto max-h-[calc(100vh-3rem)]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl font-semibold">
              {isEditMode ? "Edit CCTV" : "Add CCTV"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Camera Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Main Gate"
              {...register("name", { required: "Camera name is required" })}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Full URL */}
          <div>
            <label htmlFor="fullUrl" className="text-sm font-medium">
              Full Stream URL
            </label>
            <Input
              id="fullUrl"
              placeholder="rtsp://user:pass@ip:port/path or http://ip:port/path"
              {...register("fullUrl", { required: "Stream URL is required" })}
            />
            {errors.fullUrl && <p className="text-sm text-destructive">{errors.fullUrl.message}</p>}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              placeholder="e.g., Entrance Lobby"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          {/* Is Active - Switch instead of checkbox */}
          <div className="flex items-center justify-between">
            <label htmlFor="isActive" className="text-sm font-medium">
              Active
            </label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <input type="hidden" {...register("isActive")} />
          </div>

          {/* Buttons */}
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isSubmitting}>
              {isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditMode ? "Updating" : "Creating"}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <Edit className="mr-2 h-4 w-4" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  {isEditMode ? "Update" : "Create"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
