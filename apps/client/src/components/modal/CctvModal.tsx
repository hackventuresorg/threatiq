import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/axios";
import { createCctv } from "@/queries/cctv";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Video, PlusCircle } from "lucide-react";
import { useParams } from "react-router-dom";
interface CreateCctvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CctvModal({ isOpen, onClose }: CreateCctvModalProps) {
  const { orgId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ICctv>({
    defaultValues: {
      name: "",
      rtspPath: "",
      publicIp: "",
      port: "554",
      username: "",
      password: "",
      location: "",
      camCode: "",
      isActive: true,
    },
  });

  const cctvMutation = useMutation({
    mutationFn: createCctv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cctvs"] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating CCTV:", error);
    },
  });

  const onSubmit: SubmitHandler<ICctv> = (data) => {
    cctvMutation.mutate({ ...data, organization: orgId });
  };

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
            <DialogTitle className="text-xl font-semibold">Add CCTV</DialogTitle>
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

          {/* RTSP Path */}
          <div>
            <label htmlFor="rtspPath" className="text-sm font-medium">
              RTSP Path
            </label>
            <Input
              id="rtspPath"
              placeholder="rtsp://user:pass@ip:port/path"
              {...register("rtspPath", { required: "RTSP path is required" })}
            />
            {errors.rtspPath && (
              <p className="text-sm text-destructive">{errors.rtspPath.message}</p>
            )}
          </div>

          {/* Public IP */}
          <div>
            <label htmlFor="publicIp" className="text-sm font-medium">
              Public IP
            </label>
            <Input
              id="publicIp"
              placeholder="e.g., 192.168.0.1"
              {...register("publicIp", { required: "Public IP is required" })}
            />
            {errors.publicIp && (
              <p className="text-sm text-destructive">{errors.publicIp.message}</p>
            )}
          </div>

          {/* Port */}
          <div>
            <label htmlFor="port" className="text-sm font-medium">
              Port
            </label>
            <Input
              id="port"
              type="number"
              placeholder="554"
              {...register("port", { required: "Port is required" })}
            />
            {errors.port && <p className="text-sm text-destructive">{errors.port.message}</p>}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input id="username" placeholder="Username" {...register("username")} />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input id="password" type="password" placeholder="Password" {...register("password")} />
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

          {/* Cam Code */}
          <div>
            <label htmlFor="camCode" className="text-sm font-medium">
              Camera Code
            </label>
            <Input
              id="camCode"
              placeholder="e.g., CAM123"
              {...register("camCode", { required: "Camera code is required" })}
            />
            {errors.camCode && <p className="text-sm text-destructive">{errors.camCode.message}</p>}
          </div>

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="isActive" {...register("isActive")} />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active
            </label>
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
            <Button type="submit" disabled={cctvMutation.isPending || isSubmitting}>
              {cctvMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
