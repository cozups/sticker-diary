export interface Schedule {
  id?: string;
  title: string;
  description: string;
  date: Date;
}

export interface Diary {
  id?: string;
  title: string;
  date: Date;
  contents: string;
  expression: string;
}
