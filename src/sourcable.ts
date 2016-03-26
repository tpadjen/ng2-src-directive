import {Response} from 'angular2/http';

export {Response} from 'angular2/http';

export interface Sourcable {
  sourceChanged?: (string) => void;
  sourceLoading?: (string) => void;
  sourceError?: (any) => void;
  sourceReceived?: (Response) => void;
}
