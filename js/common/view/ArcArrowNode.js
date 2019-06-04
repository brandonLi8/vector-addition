// Copyright 2019, University of Colorado Boulder

/**
 * Create a node that represents the arrow and arc of an arc-arrow
 * Suppports negative angles
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants

  class ArcArrowNode extends Node {
    /**
     * Create a node that draws a arc-arrow arround the point (0, 0)
     * @param {Number} angle - the angle of the arc arrow in degrees
     * @param {Number} radius - the radius of the arc arrow
     * @param {Object} options
     */
    constructor( angle, radius, options ) {

      options = _.extend( {
        center: Vector2.ZERO, // {Vector2} the coordinates that the arc revolves around
        arrowheadWidth: 7, // {Number} the arrowhead width before translation
        arrowheadHeight: 5, // {Number} the arrowhead height before translation
        arcOptions: null, // {Object} filled in bellow
        arrrowOptions: null, // {Object} filled in bellow,
        includeArrowhead: true // {Boolean} option to exclude the arrowhead
      }, options );

      // overide the arcOptions with the default provided bellow
      options.arcOptions = _.extend( {
        stroke: 'black'
      }, options.arcOptions );

      // overide the arrowOptions with the default provided bellow
      options.arrowOptions = _.extend( {
        fill: 'black'
      }, options.arrowOptions );

      super();

      // @public (read-only) {Object} the options provided by the user of the arc arrow
      this.options = options;

      // @public (read-only) {Number} the angle (degrees) that the arc arrow is at
      this.angle = angle;

      // @public (read-only) {Number} the radius of the arc
      this.radius = radius;

      // create a shape for the arc of the angle, set to null, shape will be updated later
      const arcShape = new Shape();

      // @private {Path} the path for the arc shape
      this.arcPath = new Path( arcShape, options.arcOptions );

      // create the arrowhead shape of the arc
      const arrowheadShape = new Shape();

      // create the triangle that will be translated/rotated later
      // define the triangle as a triangle that is upright and the midpoint of the base is defined as (0, 0)
      arrowheadShape.moveTo( 0, 0 )
        .lineTo( -options.arrowheadWidth / 2, 0 )
        .lineTo( options.arrowheadWidth / 2, 0 )
        .lineTo( 0, -options.arrowheadHeight )
        .lineTo( -options.arrowheadWidth / 2, 0 )
        .close();

      // @private {Path} the path for the arrowHead shape
      this.arrowheadPath = new Path( arrowheadShape, options.arrowOptions );

      // add children the paths to the scene graphs
      this.setChildren( [ this.arcPath, this.arrowheadPath ] );

      // set the position and rotation of the arrowhead and the sweep of the arc
      this.setAngleAndRadius( angle, radius, options.includeArrowhead );
    }

    /**
     * @param {Number} angle - the angle of the arc arrow in degrees
     * @param {Number} radius - the radius of the arc in view coordinates
     * @param {Boolean} includeArrowhead
     * @private
     */
    setAngleAndRadius( angle, radius, includeArrowhead ) {

      // reassign the properties
      this.angle = angle;
      this.radius = radius;

      // convenience variable
      const angleInRadians = Util.toRadians( angle );

      // {boolean} is the arc anticlockwise (measured from positive x-axis) or clockwise.
      const isAnticlockwise = angle >= 0;

      // the arrowhead subtended angle is defined as the angle between the vector to the tip of the arrow
      // and the vector to the first point the arc and the triangle intersect
      const arrowheadSubtentedAngle = Math.asin( this.options.arrowheadHeight / radius );

      // the corrected angle is the angle that is between the vector that goes to the first point the arc
      // and the triangle intersect and the vector along the baseline (x-axis).
      // this is used instead the create a more accurate angle excluding the size of the triangle
      const correctedAngle = isAnticlockwise ?
                             angleInRadians - arrowheadSubtentedAngle :
                             angleInRadians + arrowheadSubtentedAngle;


      // create the arc shape
      const arcShape = new Shape().arcPoint(
        this.options.center, radius, 0, includeArrowhead ? -correctedAngle : -angleInRadians, isAnticlockwise
      );

      this.arcPath.setShape( arcShape );

      // adjust the position and angle of arrowhead
      // rotate the arrowhead from the tip into the correct position from the original angle
      this.arrowheadPath.setRotation( isAnticlockwise ?
                                      -angleInRadians :
                                      -angleInRadians + Math.PI
      );

      // translate the tip of arrowhead to the tip of the arc.
      this.arrowheadPath.setTranslation(
        this.options.center.x + Math.cos( includeArrowhead ? correctedAngle : angleInRadians ) * radius,
        this.options.center.y - Math.sin( includeArrowhead ? correctedAngle : angleInRadians ) * radius
      );
    }

    /**
     * @returns {number} the angle of the arc arrow in degrees
     * @public (read-only)
     */
    getAngle() {
      return this.angle;
    }

    /**
     * @returns {number} the radius of the arc arrow in view coordinates
     * @public (read-only)
     */
    getRadius() {
      return this.radius;
    }

    /**
     * @param {number} angle - the angle of the arc arrow in degrees
     * @public
     */
    setAngle( angle ) {
      this.setAngleAndRadius( angle, this.radius );
    }

    /**
     * @param {number} radius - the radius of the arc arrow in view coordinates
     * @public
     */
    setRadius( radius ) {
      this.setAngleAndRadius( this.angle, radius );
    }

    /**
     * @param {boolean} visible
     * @public
     */
    setArrowheadVisibility( visible ) {
      this.arrowheadPath.visible = visible;
      this.setAngleAndRadius( this.angle, this.radius, visible );
    }


  }

  return vectorAddition.register( 'ArcArrowNode', ArcArrowNode );
} );

