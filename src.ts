import {SrcDirective as Source} from './src/src.directive';

export {
  SrcDirective as Source,
  SourceDebounceTime
} from './src/src.directive';
export {
  OnSourceChanged,
  OnSourceError,
  OnSourceLoading,
  OnSourceReceived,
  Response
} from './src/sourcable';

// for angular-cli
export default {
    directives: [Source]
}
