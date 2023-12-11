import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ColumnDef } from "@tanstack/react-table";

interface TopicProps {
  id: number;
  topic: String;
  distance: number;
  created: Date;
}

const Topic = () => {
  return (
    <Card className="flex h-20 justify-between">
      <Avatar className="h-10 translate-y-5 flex-none">
        <AvatarImage src="https://github.com/shadcn.png" />
      </Avatar>
      <div className="ml-4 mt-2 space-y-1 flex-grow">
        <p className="text-lg font-bold leading-none">一起吃饭</p>
        <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
      </div>
      <div className="space-y-1 flex-none">
        <p className="text-lg font-bold leading-none">一起吃饭</p>
        <p className="text-sm text-muted-foreground">olivia</p>
      </div>
    </Card>
  );
};

export default function TopicCard() {
  return <Topic />;
}
