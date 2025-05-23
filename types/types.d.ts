interface User {
    id: string;
    name: string;
    currentTopicId: string;
    currentStageNumber: number;
  }
  
  interface Topic {
    id: string;
    name: string;
  }
  
  interface Stage {
    id: string;
    title: string;
    number: number;
    topic: Topic;
  }
  
  interface KnowledgeState {
    id: string;
    stage: Stage;
    mastery: number; // Value between 0 and 1
  }
  
  interface Skill {
    id: string;
    name: string;
  }
  
  interface SkillProgress {
    id: string;
    skill: Skill;
    mastery: number; // Value between 0 and 1
  }
  
 export interface DashboardInfo {
    user: User;
    currentStage: Stage | null;
    knowledgeStates: KnowledgeState[];
    skillProgress: SkillProgress[];
  }
  

  interface SkillStats {
    correct: number;
    total: number;
  }

  interface SkillsRecord {
    [key: string]: SkillStats;
  }

  interface VerdictRecord {
    [key: string]: { accuracy: number; verdict: string };
  }

  interface DifficultyStats {
    correct: number;
    total: number;
  }

  interface DifficultyRecord {
    [key: string]: DifficultyStats;
  }