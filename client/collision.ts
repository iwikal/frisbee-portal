import { Vector } from '../shared/vector'

export interface Collider {
  farthestPointInDirection(direction: Vector): Vector
}

export class ColliderCircle implements Collider {
  radius: number

  constructor(radius: number) {
    this.radius = radius
  }

  farthestPointInDirection(direction: Vector) {
    return direction.scaled(this.radius / direction.length())
  }
}

export class ColliderBox implements Collider {
  width: number
  height: number

  constructor(width = 1, height = 1) {
    this.width = width
    this.height = height
  }

  farthestPointInDirection({ x, y }: Vector) {
    function coeff(a: number) {
      return (Math.sign(a) || 1) / 2
    }

    return new Vector(
      coeff(x) * this.width,
      coeff(y) * this.height,
    )
  }
}

function support(
  collider1: Collider,
  collider2: Collider,
  relativePosition: Vector,
  direction: Vector,
) {
  const a = collider1.farthestPointInDirection(direction)
  const b = collider2.farthestPointInDirection(direction.negated())

  return a.minus(b.plus(relativePosition))
}

function nearZero(a: number): boolean {
  const TOLERANCE = .0001
  return Math.abs(a) < TOLERANCE
}

function clamp(a: number, lower: number, upper: number): number {
  a = Math.max(a, lower)
  a = Math.min(a, upper)
  return a
}

//the iterations count after which the result will be 0
const MAX_ITER = 30

function closestPointOnSegmentToOrigin(a: Vector, b: Vector): Vector {
  //vector representing the line
  const ab = new Vector(b).minus(a)

  // get the length squared of the line
  const abLenSq = ab.lengthSquared()
  //if a == b
  if (nearZero(abLenSq)) {
    return a
  }

  // get the position from the first line point to the projection
  // make sure t is in between 0.0 and 1.0
  const t = clamp(-a.dot(ab) / abLenSq, 0, 1)
  return ab.scaled(t).plus(a)
}


export function distance(collider1: Collider, collider2: Collider, relativePosition: Vector){
  let direction = relativePosition
  let a = support(collider1, collider2, relativePosition, direction)
  let b = support(collider1, collider2, relativePosition, direction.negated())

  for (let i = 0; i < MAX_ITER; i++) {
    const p = closestPointOnSegmentToOrigin(a, b)
    const pLength = p.length()

    if (nearZero(pLength)) {
      // the origin is on the Minkowski Difference
      // I consider this touching/collision
      return 0
    }

    // p.to(origin) is the new direction
    // we normalize here because we need to check the
    // projections along this vector later
    direction = p.scaled(-1 / pLength)
    const c = support(collider1, collider2, relativePosition, direction)
    // is the point we obtained making progress
    // towards the goal (to get the closest points
    // to the origin)
    const dc = c.dot(direction)
    // you can use a or b here it doesn't matter
    const da = a.dot(direction)

    if (nearZero(dc - da)) {
      return -dc
    }

    // if we are still getting closer then only keep
    // the points in the simplex that are closest to
    // the origin (we already know that c is closer
    // than both a and b)
    if (a.lengthSquared() < b.lengthSquared()) {
      b = c
    } else {
      a = c
    }
  }

  return 0
}
