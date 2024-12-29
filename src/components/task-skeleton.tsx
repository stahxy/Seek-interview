import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
	return (
		<Card className="w-full">
			<CardContent className="pt-6">
				<Skeleton className="h-6 w-3/4 mb-2" />
				<Skeleton className="h-4 w-full mb-4" />
				<Skeleton className="h-4 w-1/4" />
			</CardContent>
			<CardFooter className="flex justify-between">
				<Skeleton className="h-10 w-20" />
				<Skeleton className="h-10 w-20" />
			</CardFooter>
		</Card>
	);
}
