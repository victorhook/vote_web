from django.db import models
import secrets, binascii


def random_bytes():
    return binascii.b2a_base64(secrets.token_bytes(20)).decode('utf-8')[:-1]


class Submission(models.Model):
    team = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    theme = models.CharField(max_length=100)
    visible = models.BooleanField(default=True)

    def __str__(self) -> str:
        return str(self.team)


class SubmissionFile(models.Model):
    file = models.FileField(upload_to='static/uploads/')
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    is_video = models.BooleanField(blank=True, default=False)

    def __str__(self) -> str:
        return str(self.file)


class Vote(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    voter = models.CharField(max_length=120)

    def __str__(self) -> str:
        return str(self.submission)



class Guess(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    theme = models.CharField(max_length=100)

    def __str__(self) -> str:
        return f'[{self.submission}] {self.theme}'



class Code(models.Model):
    code = models.CharField(max_length=64, default=random_bytes)
    max = models.IntegerField(default=2)
    used = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f'[{self.used}/{self.max}] {self.code}'
