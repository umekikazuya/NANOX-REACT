import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { DescriptionTextarea, StatusSelect, TagSelect, TaskSubmit, TitleInput } from "../../components/Input";
import { postData } from "../../utils/Utils";
import { toast } from "react-toastify";
import { TaskBodyDataType, TaskFormData, TaskRelatedData } from "../../type/Index";
import styled from "styled-components";

const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
  const endpoint = "https:/drupal.sandbox.dev.lando/jsonapi/node/task";
  const headers = {
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  };
  const bodyData: TaskBodyDataType = {
    data: {
      type: "node--task",
      attributes: {
        title: data.title,
        field_description: data.description,
      },
      relationships: {},
    },
  };

  const relatedData: TaskRelatedData[] = [];
  if (data.project && data.project.value) {
    relatedData.push({
      type: "taxonomy_term--project",
      id: data.project.value,
    });
  }

  if (data.status && data.status.value) {
    relatedData.push({
      type: "taxonomy_term--status",
      id: data.status.value,
    });
  }

  const generateRelatedData = (value: string, type: string): TaskRelatedData => ({
    type,
    id: value,
  });
  if (data.tags && data.tags.length) {
    data.tags.forEach((tag) => {
      relatedData.push(generateRelatedData(tag.value, "taxonomy_term--tags"));
    });
  }

  relatedData.forEach((related) => {
    const relationshipKey = `field_ref_${related.type.split("--")[1]}`;
    bodyData.data.relationships[relationshipKey] = {
      data: related,
    };
  });

  try {
    await postData(endpoint, headers, bodyData);
    toast.success(`Nodeの投稿に成功しました。${data.title}`);
  } catch (error) {
    console.error("Nodeの投稿に失敗しました。", error);
    toast.error("Nodeの投稿に失敗しました。");
  }
};

export const TaskPostForm: React.FC = () => {
  const methods = useForm<TaskFormData>();
  return (
    <>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <TitleInput />
          <DescriptionTextarea />
          <StatusSelect />
          <TagSelect />
          <TaskSubmit />
        </Form>
      </FormProvider>
    </>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 40px;
`;
