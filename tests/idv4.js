import uuid from './libs/uuid.js';

export default function () {
  // Generate a UUID v1
  const uuid1 = uuid.v1();
  console.log(uuid1);

  // Generate a UUID v4
  const uuid4 = uuid.v4();
  console.log(uuid4);
}