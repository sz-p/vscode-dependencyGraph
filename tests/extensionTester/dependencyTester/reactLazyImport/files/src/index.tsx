const OtherComponent_1 = React.lazy(() => import('./OtherComponent-1'));
const OtherComponent_2 = React.lazy(() => { return import('./OtherComponent-2') });
const OtherComponent_3 = React.lazy(function () { return import('./OtherComponent-3') });
