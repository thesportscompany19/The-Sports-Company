"use client";

import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CustomTabs } from "@/components/common/CustomTabs";
import { RulesContent, type RulesData } from "@/components/rules/RulesContent";

const SPORT_TABS = [
  { value: "cricket",     label: "Cricket",      icon: "🏏" },
  { value: "football",    label: "Football",     icon: "⚽" },
  { value: "basketball",  label: "Basketball",   icon: "🏀" },
  { value: "tennis",      label: "Tennis",       icon: "🎾" },
  { value: "badminton",   label: "Badminton",    icon: "🏸" },
  { value: "tabletennis", label: "Table Tennis", icon: "🏓" },
  { value: "hockey",      label: "Hockey",       icon: "🏑" },
  { value: "volleyball",  label: "Volleyball",   icon: "🏐" },
];

const RULES_DATA: Record<string, RulesData> = {
  cricket: {
    overview:
      "Cricket is played between two teams of 11 players each. The game is played on a cricket ground with a rectangular pitch in the centre. Teams alternate between batting and fielding; the team with the most runs at the end wins.",
    ageCategories: ["Under-14", "Under-17", "Under-19", "Under-23", "Open"],
    scoringSystem: [
      "Each run scored by the batting team adds 1 point.",
      "Boundaries: 4 runs (ground contact), 6 runs (clean over boundary).",
      "Wickets reduce the batting order; the innings ends at 10 wickets.",
      "Bonus points awarded for net run-rate in group stages.",
    ],
    disqualificationRules: [
      "Use of banned substances or doping results in immediate disqualification.",
      "Ball tampering leads to 5-run penalty and possible match ban.",
      "Deliberate time-wasting after two warnings results in disqualification.",
      "Verbal or physical abuse of an opponent or umpire leads to immediate removal.",
    ],
  },
  football: {
    overview:
      "Football (soccer) is a team sport played between two sides of 11 players. The objective is to score by putting the ball into the opposing team's goal. The team with the most goals after 90 minutes wins.",
    ageCategories: ["Under-12", "Under-15", "Under-17", "Under-21", "Open"],
    scoringSystem: [
      "Each goal counts as 1 point.",
      "Penalty shoot-outs used to decide draws in knockout rounds.",
      "Group stage: Win = 3 pts, Draw = 1 pt, Loss = 0 pts.",
      "Goal difference and head-to-head used as tiebreakers.",
    ],
    disqualificationRules: [
      "Two yellow cards in a single match result in a red card and ejection.",
      "A straight red card earns at least a one-match suspension.",
      "Violent conduct off-ball leads to immediate disqualification from the tournament.",
      "Fielding an ineligible player results in a 3-0 forfeit.",
    ],
  },
  basketball: {
    overview:
      "Basketball is a team sport in which two teams of five players compete to shoot a ball through the opposing team's hoop. Games consist of four quarters; the highest-scoring team wins.",
    ageCategories: ["Under-14", "Under-16", "Under-18", "Under-21", "Open"],
    scoringSystem: [
      "Field goal (inside arc): 2 points.",
      "Three-point shot (outside arc): 3 points.",
      "Free throw: 1 point each.",
      "Overtime periods of 5 minutes to break ties.",
    ],
    disqualificationRules: [
      "Five personal fouls result in disqualification from the match.",
      "A flagrant-2 foul results in immediate ejection.",
      "Unsportsmanlike conduct after a technical foul leads to ejection.",
      "Any form of match manipulation results in tournament disqualification.",
    ],
  },
  tennis: {
    overview:
      "Tennis is an individual or doubles sport played on a rectangular court. Players use rackets to hit a ball over a net, scoring points through a defined system of love, 15, 30, 40, and game.",
    ageCategories: ["Under-12", "Under-14", "Under-18", "Open", "Veterans (35+)"],
    scoringSystem: [
      "Points: Love (0), 15, 30, 40; deuce at 40-40 requires two consecutive points.",
      "Six games win a set; tiebreak at 6-6.",
      "Best of 3 sets for most categories; best of 5 for Open Men's finals.",
      "Super tiebreak (10 points) used in lieu of third set for doubles.",
    ],
    disqualificationRules: [
      "Three code violations in a match result in disqualification.",
      "Racket abuse after one warning leads to point penalty then game penalty.",
      "Refusing to continue play after a legitimate ruling results in default.",
      "Positive doping test results in immediate disqualification and suspension.",
    ],
  },
  badminton: {
    overview:
      "Badminton is a racket sport played by opposing players (singles) or pairs (doubles) using a shuttlecock across a high net. Rally-point scoring is used; the side winning a rally scores a point.",
    ageCategories: ["Under-13", "Under-15", "Under-17", "Under-19", "Open"],
    scoringSystem: [
      "Best of 3 games; each game played to 21 points.",
      "A side must win by 2 points; game cap is 30-29.",
      "The side winning 2 games first wins the match.",
      "Service alternates based on points scored.",
    ],
    disqualificationRules: [
      "Deliberate shuttle abuse or delay of play results in point penalty.",
      "Two consecutive conduct penalties lead to game forfeit.",
      "Physical contact with an opponent results in immediate disqualification.",
      "Using non-regulation shuttlecocks without umpire approval forfeits the rally.",
    ],
  },
  tabletennis: {
    overview:
      "Table Tennis (ping-pong) is played on a hard table divided by a net. Players hit a lightweight ball back and forth using small rackets. Fast-paced rallies and spin are central to the sport.",
    ageCategories: ["Under-12", "Under-15", "Under-18", "Under-21", "Open"],
    scoringSystem: [
      "Each game is played to 11 points; must win by 2.",
      "Best of 5 or 7 games depending on the round.",
      "Service alternates every 2 points; both sides serve at 10-10.",
      "Expedite rule applied if a game exceeds 10 minutes.",
    ],
    disqualificationRules: [
      "Deliberate bat damage or surface alteration during play is prohibited.",
      "Obstructing the ball path with the free hand leads to a point loss.",
      "Two conduct warnings result in disqualification from the match.",
      "Coaching during play is prohibited in singles events.",
    ],
  },
  hockey: {
    overview:
      "Field Hockey is a team sport played on a grass or synthetic turf field. Two teams of 11 players each use sticks to drive a ball into the opposing team's goal. Teams play two halves of 35 minutes each.",
    ageCategories: ["Under-14", "Under-16", "Under-18", "Under-21", "Open"],
    scoringSystem: [
      "Each goal counts as 1 point.",
      "Goals can only be scored from within the shooting circle.",
      "Penalty corners and penalty strokes awarded for specific infractions.",
      "Stroke-off (similar to penalty shootout) used in tied knockout matches.",
    ],
    disqualificationRules: [
      "Dangerous play (raised ball above shoulder height) results in a free hit or penalty corner.",
      "A green card = 2-minute suspension; yellow card = 5–10 minutes; red card = ejection.",
      "Persistent misconduct after two cards leads to match disqualification.",
      "Use of non-regulation equipment results in forfeiture of the match.",
    ],
  },
  volleyball: {
    overview:
      "Volleyball is a team sport in which two teams of six players are separated by a net. Each team tries to score points by grounding a ball on the other team's court. Rally-point scoring is used.",
    ageCategories: ["Under-14", "Under-16", "Under-18", "Under-21", "Open"],
    scoringSystem: [
      "Each game (set) is played to 25 points, with a 2-point lead required to win.",
      "Deciding set (5th) is played to 15 points with a 2-point lead.",
      "Best of 5 sets; first team to win 3 sets wins the match.",
      "Every rally results in a point for the winning side (rally-point system).",
    ],
    disqualificationRules: [
      "Touching the net during play results in a point for the opponent.",
      "Receiving four sanctions (yellow+red combination) leads to disqualification.",
      "A red card for rude conduct results in immediate disqualification.",
      "Blocking a serve is prohibited and results in a replay or point loss.",
    ],
  },
};

interface RulesSectionProps {
  title?: string;
  subtitle?: string;
}

export function RulesSection({
  title = "Rules & Regulations",
  subtitle = "Know the rules before you compete — official guidelines for each sport",
}: RulesSectionProps) {
  return (
    <SectionWrapper id="rules" title={title} subtitle={subtitle} className="bg-[#F4F6F8]">
      <CustomTabs tabs={SPORT_TABS} variant="dark" scrollable>
        {(activeTab) => (
          <RulesContent data={RULES_DATA[activeTab]} />
        )}
      </CustomTabs>
    </SectionWrapper>
  );
}
