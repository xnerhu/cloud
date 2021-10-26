import { ProjectOptions } from "./project";

export interface CreateIssueOptions {
  project: ProjectOptions;
  summary: string;
  description: string;
  issuetype: IssueType;
  labels: string[];
}

export interface CreateIssueResponse {
  id: string;
  key: string;
  self: string;
}

export interface IssueType {
  name: string;
}
