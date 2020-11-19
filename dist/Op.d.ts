import AttributeMap from './AttributeMap';
interface Op {
    insert?: string | object;
    delete?: number;
    retain?: number;
    attributes?: AttributeMap;
}
declare namespace Op {
    function length(op: Op): number;
}
export default Op;
