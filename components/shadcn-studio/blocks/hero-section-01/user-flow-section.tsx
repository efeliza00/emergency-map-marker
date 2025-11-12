import FadeContent from "@/components/FadeContent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocateFixed, NotebookPen, Send } from "lucide-react";

const UserFlowSection = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <h1 className="col-span-full mx-auto text-5xl font-bold my-10">
        Fast and Simple
      </h1>
      <FadeContent
        blur={true}
        duration={500}
        easing="ease-out"
        initialOpacity={0}
        delay={300}
      >
        <Card className="text-center flex flex-col h-full">
          <CardHeader className="flex flex-col items-center ">
            <div className="p-4 bg-blue-100 rounded-full">
              <LocateFixed className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="leading-1 text-xl font-medium">
              Pinpoint Your Spot
            </CardTitle>
            <p className="text-muted-foreground leading-0.5 text-xs">
              Find your location on the map
            </p>
          </CardHeader>

          <CardContent>
            <CardDescription className="text-lg">
              Use the interactive map to accurately locate the exact area you
              want to report or interact with.
            </CardDescription>
          </CardContent>
        </Card>
      </FadeContent>
      <FadeContent
        blur={true}
        duration={500}
        easing="ease-out"
        initialOpacity={0}
        delay={600}
      >
        <Card className="text-center flex flex-col h-full">
          <CardHeader className="flex flex-col items-center ">
            <div className="p-4 bg-yellow-100 rounded-full">
              <NotebookPen className="h-8 w-8 text-yellow-500" />
            </div>
            <CardTitle className="leading-1 text-xl font-medium">
              Add the Emergency Details
            </CardTitle>
            <p className="text-muted-foreground leading-0.5 text-xs">
              Click the location to open a form
            </p>
          </CardHeader>

          <CardContent>
            <CardDescription className="text-lg">
              A quick form will pop up where you can input specific information,
              details, or comments about that precise location.
            </CardDescription>
          </CardContent>
        </Card>
      </FadeContent>
      <FadeContent
        blur={true}
        duration={500}
        easing="ease-out"
        initialOpacity={0}
        delay={900}
      >
        <Card className="text-center flex flex-col h-full">
          <CardHeader className="flex flex-col items-center ">
            <div className="p-4 bg-green-100 rounded-full">
              <Send className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="leading-1 text-xl font-medium">
              Finalize & Share
            </CardTitle>
            <p className="text-muted-foreground leading-0.5 text-xs">
              Submit the form
            </p>
          </CardHeader>
          {/* Added flex-grow to ensure content fills the remaining space */}
          <CardContent>
            <CardDescription className="text-lg">
              Confirm your details, hit submit, and your information will be
              instantly shared to the world.
            </CardDescription>
          </CardContent>
        </Card>
      </FadeContent>
    </div>
  );
};

export default UserFlowSection;
