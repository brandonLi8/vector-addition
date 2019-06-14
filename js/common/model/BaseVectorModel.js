// Copyright 2019, University of Colorado Boulder

/**
 * Base class for vector models for all types of vectors (sum, component, etc.). 
 * Primarily responsibilities are:
 * 
 * - tip and tail position
 * - 'attributes property' (x and y, or in other words the actual vector <x, y>)
 * - label
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class BaseVectorModel {
    /**
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} xMagnitude horizontal component of the vector
     * @param {number} yMagnitude vertical component of the vector
     * @param {string} label
     */
    constructor( tailPosition, xMagnitude, yMagnitude, label ) {

      // Type check arguments
      assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
      assert && assert( typeof xMagnitude === 'number', `invalid xMagnitude: ${xMagnitude}` );
      assert && assert( typeof yMagnitude === 'number', `invalid yMagnitude: ${yMagnitude}` );
      assert && assert( typeof label === 'string', `invalid label: ${label}` );


      // @public (read-only) {string}
      this.label = label;

      // @public {Vector2Property} - The tail position of the vector on the graph.
      this.tailPositionProperty = new Vector2Property( tailPosition );

      // @public {Vector2Property} - (x and y, or in other words the actual vector <x, y>)
      this.attributesVectorProperty = new Vector2Property( new Vector2( xMagnitude, yMagnitude ) );

      // @public {DerivedProperty.<Vector2>} - the tip position of the vector
      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.attributesVectorProperty ],
        ( tailPosition, vector ) => tailPosition.plus( vector ) );

      // @public {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( attributesVector.getMagnitude() )
      );

      // @public {DerivedProperty.<number>} - the angle (in degrees) of the vector
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleDegreesProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( Util.toDegrees( attributesVector.getAngle() ) )
      );


    }
    /**
     * Dispose of the vector
     * @public
     */
    dispose() {
      this.tailPositionProperty.dispose();
      this.attributesVectorProperty.dispose();
      this.tipPositionProperty.dispose();
      this.magnitudeProperty.dispose();
    }
     
    // @public Get the X magnitude.
    get xMagnitude() { return this.attributesVectorProperty.value.x; }
    // @public Get the y magnitude.
    get yMagnitude() { return this.attributesVectorProperty.value.y; }

  
    // @public Set the X magnitude. Tail position and the Y magnitude stays the same.
    set xMagnitude( magnitude ) {
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setX( magnitude );
    }
    // @public Set the y magnitude. Tail position and the x magnitude stays the same.
    set yMagnitude( magnitude ) {
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setY( magnitude );
    }


    // @public Get the magnitude.
    get magnitude() { return this.attributesVectorProperty.magnitude; }

    // @public Multiplies vector by a scalar.
    // Keeps tail position and angle the same
    multiplyScalar( scalar ) {
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.multiplyScalar( scalar );
    }

    // @public Get the X Coordinate of the tail
    get tailX() {
      return this.tailPositionProperty.value.x;
    }
    // @public Get the Y Coordinate of the tail
    get tailY() {
      return this.tailPositionProperty.value.y;
    }

    // @public Set the X coordinate of the tail
    set tailX( x ) {
      this.tailPositionProperty.value = this.tailPositionProperty.value.setX( x );
    }
    // @public
    set tailY( y ) {
      this.tailPositionProperty.value = this.tailPositionProperty.value.setY( y );
    }

    // @public Get the X Coordinate of the tip
    get tipX() {
      return this.tipPositionProperty.value.x;
    }
    // @public Get the Y Coordinate of the tip
    get tipY() {
      return this.tipPositionProperty.value.x;
    }
  }

  return vectorAddition.register( 'BaseVectorModel', BaseVectorModel );
} );