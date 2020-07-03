export type AllowedMentionType = "roles" | "users" | "everyone";

export interface AllowedMentions {
    parse?: AllowedMentionType[];
    roles?: string[];
    users?: string[];
}
