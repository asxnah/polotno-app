export interface StepResponse {
  status: boolean;
  data: Step;
}

export interface Step {
  id: number;
  scheme_description?: SchemeDescription;
  media: MediaItem[];
}

export interface SchemeDescription {
  videoEditorProject?: {
    projectConfig?: string;
  };
}

export interface MediaItem {
  id: number;
  file_info: {
    id: number; // mediaId
    s3_url: string;
    mimetype: string;
  };
}
