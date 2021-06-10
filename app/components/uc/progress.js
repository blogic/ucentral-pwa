import Component from "@glimmer/component";

export default class UcProgressComponent extends Component {
  get steps() {
    const { steps, currentStep } = this.args;

    const currentStepIndex = steps.findIndex(
      (stepName) => stepName === currentStep
    );

    return steps.reduce((acc, stepName, index) => {
      acc.push({
        stepName,
        index,
        order: index + 1,
        isActive: index <= currentStepIndex,
        type: "dot",
      });

      if (index < steps.length - 1) {
        acc.push({
          stepName,
          index,
          isActive: index + 1 <= currentStepIndex,
          type: "strikethrough",
        });
      }

      return acc;
    }, []);
  }
}
