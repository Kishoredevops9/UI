import * as go from 'gojs';
import * as _ from 'lodash/fp';
import { FROM_LABEL_NAME, LABEL_NAME, TO_LABEL_NAME } from './labels';
import { measureText } from '../../utils/measureText';

const _map = _.map.convert({ cap: false });

export class SpreadLink extends go.Link {

  computePoints() {
    const result = super.computePoints();

    this.modifyPathEnd(true);
    this.modifyPathEnd(false);
    this.updateLabels();

    return result;
  }

  private modifyPathEnd(beginning: boolean) {
    const port = beginning ? this.fromPort : this.toPort;
    const shape = this.getPortsShape(port);
    const points = this.points.toArray();
    const lastPoint = beginning ? points[0] : points[points.length - 1];
    const lastPointLocal = shape.getLocalPoint(lastPoint);

    const fraction = shape.geometry.getFractionForPoint(lastPointLocal);
    const newLocalPoint = shape.geometry.getPointAlongPath(fraction);
    const { x, y } = shape.getDocumentPoint(newLocalPoint);

    lastPoint.x = x;
    lastPoint.y = y;
  }

  private getPortsShape(port: go.GraphObject) {
    return port as go.Shape;
  }

  private updateLabels() {
    const labels = this.getLabels();

    if (_.every(({ text }) => !text)(labels)) {
      return;
    }

    const linkLength = this.getLinkLength();
    const labelsWidth = _.flowRight(
      _.sum,
      _.map(({ text, font }) => !text ? 0 : measureText(text, font).width)
    )(labels);

    this.toggleLabelsVisibility(labelsWidth < linkLength, labels);
  }

  private toggleLabelsVisibility(shouldShow: boolean, labels: go.TextBlock[]): void {
    _.forEach((label: go.TextBlock) => {
      label.visible = shouldShow;
    })(labels);
  }

  private getLabels(): go.TextBlock[] {
    return [
      this.findObject(FROM_LABEL_NAME) as go.TextBlock,
      this.findObject(LABEL_NAME) as go.TextBlock,
      this.findObject(TO_LABEL_NAME) as go.TextBlock
    ];
  }

  private getLinkLength(): number {
    const points = this.points.toArray();
    return _.flowRight(
      _.sum,
      _map(({ x, y }, idx) => {
        if (!idx) {
          return 0;
        }
        const prevPoint = points[idx - 1];

        return Math.sqrt(Math.pow(x - prevPoint.x, 2) + Math.pow(y - prevPoint.y, 2));
      })
    )(points);
  }
}
