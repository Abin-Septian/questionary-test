import { useState, useEffect, useRef } from "react";
import Stepper from "../../components/Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Countdown from "react-countdown";
import Router from "next/router";
import Link from "next/link";

const Questionnaire = ({ questions }: any) => {
  const answerRef = useRef<string[]>([]);
  const selectedRef = useRef<string | undefined>(undefined);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [endTime, setEndTime] = useState<number | undefined>();
  const [selected, setSelected] = useState<string | undefined>();
  const [answer, setAnswer] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (typeof window !== "undefined") {
        const sessionEndTime = localStorage.getItem("endTime");
        const currentQuestion = localStorage.getItem("currentQuestion");
        const sessionAnswer = localStorage.getItem("answer");

        if (sessionEndTime && currentQuestion) {
          setEndTime(Number(sessionEndTime));
          setCurrentQuestion(Number(currentQuestion));
          setAnswer(sessionAnswer ? sessionAnswer.split(",") : []);
        }
      }
    };

    loadData();

    if (endTime) {
      const timer = setTimeout(() => {
        handleSubmitAnswer(answerRef.current, selectedRef.current);
      }, endTime - new Date().getTime());

      return () => clearTimeout(timer);
    }
  }, [endTime]);

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;

    setAnswer((prev) => [...prev, selected!]);
    setSelected(undefined);

    selectedRef.current = undefined;
    answerRef.current = [...answer, selected!];

    setCurrentQuestion(nextQuestion);
    localStorage.setItem("currentQuestion", String(nextQuestion));
    localStorage.setItem(
      "answer",
      String(selected ? [...answer, selected] : answer),
    );
  };

  const handleSubmitAnswer = (answer: string[], selected: string | undefined) => {
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("endTime");
    localStorage.setItem(
      "answer",
      String(selected ? [...answer, selected] : answer),
    );

    Router.push("/");
  };

  const currentQuestionData = questions[currentQuestion];

  if (!endTime)
    return (
      <div className="flex min-h-screen items-center justify-center rounded-lg bg-gradient-to-t from-pink-500/50 to-purple-500/50 p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              Please Try Again
              <Button asChild className="w-max">
                <Link href={"/"}>Back</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-t from-pink-500/50 to-purple-500/50 p-4">
      <div className="flex min-h-screen  w-full max-w-2xl flex-col gap-12 ">
        <Stepper
          length={questions.length}
          activeIndex={currentQuestion}
        ></Stepper>
        <div className="space-y-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-purple-800/30">
                Q{currentQuestion + 1}
              </CardTitle>
              <Countdown
                date={endTime}
                precision={3}
                key={endTime}
                renderer={({ minutes, seconds }: any) => {
                  return (
                    <div className="w-28 rounded-full bg-gray-300 text-center font-semibold leading-8 text-gray-700">
                      {minutes.toString().padStart(2, "0")}:
                      {seconds.toString().padStart(2, "0")}
                    </div>
                  );
                }}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <Label className="text-2xl font-semibold text-purple-800/80">
                {currentQuestionData.question}
              </Label>
              <RadioGroup
                onValueChange={(e) => setSelected(e)}
                defaultValue={answer[0]}
              >
                {currentQuestionData.options.map((option: string, index: number) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-lg font-semibold text-purple-800/80"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          {questions.length === currentQuestion + 1 ? (
            <Button
              onClick={() => handleSubmitAnswer(answer, selected)}
              disabled={selected === undefined}
              className="w-full rounded-full font-bold md:max-w-[200px]"
            >
              Finish
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={selected === undefined}
              className="w-full rounded-full font-bold md:max-w-[200px]"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const data = require("../../questions.json");

  return {
    props: {
      questions: data.questions,
    },
  };
}

export default Questionnaire;
