<?php

namespace App\Observers;

use App\Events\VoteCreated;
use App\Events\VoteDeleted;
use App\Models\Votes;

class VoteObserver
{
    public function created(Votes $vote)
    {
        $vote->candidate->increment('votes');
        event(new VoteCreated($vote));
    }

    public function deleted(Votes $vote)
    {
        $vote->candidate->decrement('votes');
        event(new VoteDeleted($vote));
    }
}
