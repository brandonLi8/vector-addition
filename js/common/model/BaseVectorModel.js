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
    
      //----------------------------------------------------------------------------------------

      // @public (read-only) {string}
      this.label = label;

      // @private {Vector2Property} - The tail position of the vector on the graph.
      // Read/Write Access to the tail position documented below in get tail();
      this.tailPositionProperty = new Vector2Property( tailPosition );

      // @private {Vector2Property} - (x and y, or in other words the actual vector <x, y>)
      // Read/Write Access to the tail x and y magnitudes documented below;
      this.attributesVectorProperty = new Vector2Property( new Vector2( xMagnitude, yMagnitude ) );

      // @private {DerivedProperty.<Vector2>} - the tip position of the vector
      // Read Access to the tip position documented below in get tip(); (there is no write access)
      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.attributesVectorProperty ],
        ( tailPosition, vector ) => tailPosition.plus( vector ) );

      // @private {DerivedProperty.<number>} - the magnitude of the vector
      // Read/Write Access to the  magnitudes documented below in get magnitude();
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( attributesVector.getMagnitude() )
      );

      // @private {DerivedProperty.<number>} - the angle (in degrees) of the vector
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      // Read Access to the angle documented below in get tip(); (there is no write access)
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
      this.angleDegreesProperty.dispose();
    }
     
    /*---------------------------------------------------------------------------*
     * The Following are convenience Read/Write methods since most of the
     * properties above are private.
     *---------------------------------------------------------------------------*/

    /**
     * @public Convenience method to multiply the vector by a scalar. Keeps tail position and angle the same.
     */
    multiplyScalar( scalar ) {
      assert && assert ( typeof scalar === 'number', `invalid scalar: ${scalar}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.multiplyScalar( scalar );
    }

    //----------------------------------------------------------------------------------------
    // Magnitude
    /**
     * @public read access to the magnitude
     * @returns {Vector2}
     */
    get magnitude() { return this.attributesVectorProperty.magnitude; }
    /**
     * @public write access to the magnitude. This keeps the tail position and the angle constant.
     */
    set magnitude( magnitude ) { 
      assert && assert ( typeof magnitude === 'number', `invalid magnitude: ${magnitude}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setMagntude( magnitude );
    }

    //----------------------------------------------------------------------------------------
    // xMagnitude
    /**
     * @public convenience method to access to the x magnitude
     * @returns {number}
     */
    get xMagnitude() { return this.attributesVectorProperty.value.x; }
    /**
     * @public convenience method to set to the x magnitude
     * Keeps the yMagnitude, tailPosition constant
     */
    set xMagnitude( magnitude ) {
      assert && assert ( typeof magnitude === 'number', `invalid magnitude: ${magnitude}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setX( magnitude );
    }

    //----------------------------------------------------------------------------------------
    // yMagnitude
    /**
     * @public convenience method to access to the y magnitude
     * @returns {number}
     */
    get yMagnitude() { return this.attributesVectorProperty.value.y; }
    /**
     * @public convenience method to set to the y magnitude
     * Keeps the xMagnitude, tailPosition constant
     */
    set yMagnitude( magnitude ) {
      assert && assert ( typeof magnitude === 'number', `invalid magnitude: ${magnitude}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setY( magnitude );
    }


    //----------------------------------------------------------------------------------------
    // Tail Position
    /**
     * @public Read access to tail position
     * @returns {Vector2}
     */
    get tail() { return this.tailPositionProperty.value; }
    /**
     * @public Write access to tail position
     * Sets the tail position (this will update the tip as well to keep magnitude/angle the same)
     */
    set tail( point ) { 
      assert && assert( point instanceof Vector2, `invalid point: ${point}` );
      this.tailPositionProperty.value = point; 
    }
    /**
     * @public Write access to tail position
     * Sets the tail position (this will update the tip as well to keep magnitude/angle the same)
     */
    setTailXY( x, y ) { 
      this.tailX = x; // see documentation below
      this.tailY = y; // see documentation below
    }


    //----------------------------------------------------------------------------------------
    // Tail X Position
    /**
     * @public Read access to tail x
     * @returns {number}
     */
    get tailX() { return this.tailPositionProperty.value.x; }
    /**
     * @public Write access to tail x
     * Sets the tail position (this will update the tip as well to keep magnitude/angle the same)
     */
    set tailX( x ) {
      assert && assert ( typeof x === 'number', `invalid x: ${x}` );
      this.tailPositionProperty.value = this.tailPositionProperty.value.setX( x );
    }

    //----------------------------------------------------------------------------------------
    // Tail Y Position
    /**
     * @public Read access to tail Y
     * @returns {number}
     */
    get tailY() { return this.tailPositionProperty.value.y; }
    /**
     * @public Write access to tail Y
     * Sets the tail position (this will update the tip as well to keep magnitude/angle the same)
     */
    set tailY( y ) {
      assert && assert ( typeof y === 'number', `invalid y: ${y}` );
      this.tailPositionProperty.value = this.tailPositionProperty.value.setY( y );
    }

    //----------------------------------------------------------------------------------------
    // Tip Position
    /**
     * @public Read access to tip position
     * @returns {Vector2}
     */
    get tip() { return this.tipPositionProperty.value; }
    get tipX() { return this.tipPositionProperty.value.x; }
    get tipY() { return this.tipPositionProperty.value.x; }

    //----------------------------------------------------------------------------------------
    // angle
    /**
     * @public Read access to the angle
     * @returns {number}
     */
    get angle() { return this.attributesVectorProperty.value.angle; }
  }

  return vectorAddition.register( 'BaseVectorModel', BaseVectorModel );
} );