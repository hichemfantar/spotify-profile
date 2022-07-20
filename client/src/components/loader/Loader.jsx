import { useIsFetching, useIsMutating } from "react-query";
import { Spinner } from "./styled";

export default function Loader(props) {
	const isFetching = useIsFetching();
	const isMutating = useIsMutating();

	return (
		<Spinner
			{...props}
			className={!isFetching && !isMutating ? "paused" : ""}
		/>
	);
}
