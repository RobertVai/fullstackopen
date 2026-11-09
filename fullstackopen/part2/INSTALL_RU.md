# Как добавить Part 2 к твоему репозиторию

1. Распакуй ZIP. Внутри находится папка `part2`.
2. Открой свой Git-репозиторий `fullstackopen` в VS Code. Найти его корень можно командой `git rev-parse --show-toplevel`.
3. Перенеси папку `part2` в **корень этого репозитория**, рядом с `part1`, не внутрь `part1`.
4. Запускай проекты, используя команды из `README.md`.
5. `phonebook` запускается в **двух терминалах**: `npm run server` и `npm run dev`.
6. Перед сдачей проверь работу приложений. По правилам учебного курса сообщай о самостоятельно выполненных упражнениях и не представляй неразобранный чужой код как собственный.

## Git (в терминале корня репозитория)

```bash
git add part2/courseinfo
git commit -m "feat: complete part 2 courseinfo exercises"
git push

git add part2/phonebook
git commit -m "feat: complete part 2 phonebook exercises"
git push

git add part2/countries part2/README.md part2/INSTALL_RU.md part2/.gitignore
git commit -m "feat: complete part 2 countries and weather exercises"
git push
```

> Коммить только после проверки соответствующего проекта. Если Git требует указать ветку, используй `git push -u origin main` (если твоя ветка называется main).
