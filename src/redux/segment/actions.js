import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_SEGMENTS, READ_SEGMENT, CREATE_SEGMENT, UPDATE_SEGMENT, REMOVE_SEGMENT } from 'redux/constants';

const segmentApi = restApis('projects', 'segments');

export const listSegments = createApiAction(LIST_SEGMENTS, segmentApi.list);
export const createSegment = createApiAction(CREATE_SEGMENT, segmentApi.create, { title: 'Success', detail: 'Segment is created successfully' });
export const updateSegment = createApiAction(UPDATE_SEGMENT, segmentApi.update, { title: 'Success', detail: 'Segment is updated successfully' });
export const readSegment = createApiAction(READ_SEGMENT, segmentApi.read);
export const removeSegment = createApiAction(REMOVE_SEGMENT, segmentApi.remove);
