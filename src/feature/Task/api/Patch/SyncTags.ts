import { MultiValue } from "react-select";
import { TaskDataType } from "../../type/Index";
import { taskPatchData } from "../utils/TaskFetch";

export async function SyncTags(value: MultiValue<{ label: string, value: string }>, id: string) {
  const tagsData = value.map(data => ({
    "type": "taxonomy_term--status",
    "id": data.value,
  }));

  const bodyData: TaskDataType = {
    data: {
      id: id,
      type: "node--task",
      relationships: {
        "field_ref_tags": {
          "data": tagsData,
        }
      },
    },
  };
  taskPatchData(id, bodyData);
}
