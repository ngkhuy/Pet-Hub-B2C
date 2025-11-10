export class ApiError<T = unknown> extends Error {
  status: number;
  statusText: string;
  url: string;
  method: string;
  detail?: T;

  constructor(opts: {
    status: number;
    statusText: string;
    url: string;
    method: string;
    detail?: T;
    message?: string;
  }) {
    super(opts.message ?? `HTTP ${opts.status} ${opts.statusText}`);
    this.status = opts.status;
    this.statusText = opts.statusText;
    this.url = opts.url;
    this.method = opts.method;
    this.detail = opts.detail;
  }
}
