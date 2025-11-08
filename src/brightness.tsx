import { useState, useMemo } from "react";
import { Action, ActionPanel, Icon, List, confirmAlert } from "@vicinae/api";
import { execSync } from "child_process"

const setBrightness = (brightness: number) => {
	const cmd = `brightnessctl set ${brightness}%`
	try {
		execSync(cmd)
	} catch (err: any) {
		let errmsg: string = err.toString();
		if (errmsg.includes("command not found")) {
			errmsg = `${errmsg}\nHave you installed brightnessctl? `;
		}
		confirmAlert({
			title: `Error Executing Command`, message: errmsg,
			primaryAction: {title: "I understand"}
		})
	}
}

export default function ControlledList() {
	const [searchText, setSearchText] = useState("");
	const customBrightness = parseInt(searchText);
	const defaultPercentages = useMemo(() => [...Array(10).keys()].map(i => (i + 1)*10).reverse(), []);
	const validPercentage = !isNaN(customBrightness) && (0 < customBrightness) && (customBrightness <= 100);
	const percentages = validPercentage ? [customBrightness] : searchText ?  [] : defaultPercentages;

	return (
		<List
			searchText={searchText}
			onSearchTextChange={setSearchText}
			searchBarPlaceholder={"brightnessctl set..."}
			filtering={false}
		>
			{ searchText && !validPercentage && <List.Item id="invalid-percentage" title="Invalid percentage must be between 1-100%"/> }
			{percentages.map((percent) => (
				<List.Item
					id={percent.toString()}
					key={percent}
					title={`${percent}%`}
					actions={
						<ActionPanel>
							<Action
								title="Set Brightness"
								icon={Icon.Sun}
								onAction={() =>
									setBrightness(percent)
								}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}