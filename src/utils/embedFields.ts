import { EmbedBuilder } from 'discord.js';

const __TRUNCATE_LENGTH = 1024;

export const addLongEmbedField = (
  embed: EmbedBuilder,
  name: string,
  value: string | null,
  inline: boolean = false,
) => {
  if (!value || value.length <= __TRUNCATE_LENGTH) {
    embed.addFields({ name, value: value || '', inline });
    return;
  }

  const fieldCount = Math.floor(value.length / __TRUNCATE_LENGTH);
  for (let i = 0; i < fieldCount; ++i) {
    const substring = value.substring(
      i * __TRUNCATE_LENGTH,
      (i + 1) * __TRUNCATE_LENGTH,
    );
    const localName = i === 0 ? name : `${name} (cont'd)`;
    embed.addFields({ name: localName, value: substring || '(empty)', inline });
  }
};
